import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/CustomButton';
import { FormSection } from '../components/FormSection';
import { LabeledTextInput } from '../components/LabeledTextInput';
import { MoodSelector } from '../components/MoodSelector';
import { NoActiveCollaboratorState } from '../components/NoActiveCollaboratorState';
import { useCollaborators } from '../context/useCollaborators';
import { useRecords } from '../context/useRecords';
import { formValuesToRecord, getRecordForCollaboratorDate, recordToFormValues } from '../domain/records';
import { DailyRecordFormValues, ValidationResult, validateDailyRecordForm } from '../domain/validation';
import { RootTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { confirmDestructiveAction } from '../utils/confirm';
import { formatDisplayDate, getTodayKey } from '../utils/date';

type Props = BottomTabScreenProps<RootTabParamList, 'Registro'>;

const EXERCISE_TYPES = ['Corrida', 'Caminhada', 'Musculação', 'Yoga', 'Ciclismo', 'Natação', 'Outro'];

const EMPTY_FORM: DailyRecordFormValues = {
  waterMl: '',
  sleepHours: '',
  mood: null,
  exerciseDone: false,
  exerciseType: EXERCISE_TYPES[0],
  exerciseDurationMin: '',
};

export function DailyLogScreen({ route, navigation }: Props) {
  const { state, upsertRecord, deleteRecord } = useRecords();
  const { state: collaboratorsState } = useCollaborators();
  const activeCollaboratorId = collaboratorsState.activeCollaboratorId;
  const routeDate = route.params?.date;

  const [values, setValues] = useState<DailyRecordFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<ValidationResult['errors']>({});
  const [recordDate, setRecordDate] = useState<string | null>(routeDate ?? null);
  const [dateMissingError, setDateMissingError] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const existingRecord =
    activeCollaboratorId !== null && recordDate !== null
      ? getRecordForCollaboratorDate(state.records, activeCollaboratorId, recordDate)
      : undefined;

  function applyRecordForDate(date: string) {
    if (activeCollaboratorId === null) {
      return;
    }
    const existing = getRecordForCollaboratorDate(state.records, activeCollaboratorId, date);
    setValues(existing ? recordToFormValues(existing, EXERCISE_TYPES[0]) : EMPTY_FORM);
    setErrors({});
  }

  // Intentionally excludes state.records from deps: this only needs to re-run when the
  // screen is targeted at a different date via navigation, not on every records mutation
  // (which would reset in-progress edits right after a save).
  useEffect(() => {
    setDateMissingError(false);
    if (routeDate) {
      setRecordDate(routeDate);
      applyRecordForDate(routeDate);
    } else {
      setRecordDate(null);
      setValues(EMPTY_FORM);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeDate, activeCollaboratorId]);

  function updateField<K extends keyof DailyRecordFormValues>(key: K, value: DailyRecordFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleDateChange(event: DateTimePickerEvent, selectedDate?: Date) {
    setShowDatePicker(false);
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }
    const newDate = getTodayKey(selectedDate);
    setRecordDate(newDate);
    setDateMissingError(false);
    applyRecordForDate(newDate);
  }

  function handleSubmit() {
    if (activeCollaboratorId === null) {
      return;
    }
    if (recordDate === null) {
      setDateMissingError(true);
      return;
    }
    setDateMissingError(false);

    const result = validateDailyRecordForm(values);
    setErrors(result.errors);

    if (!result.valid) {
      return;
    }

    const record = formValuesToRecord(values, activeCollaboratorId, recordDate, new Date().toISOString());
    upsertRecord(record);

    Alert.alert('Pronto', `Registro de ${formatDisplayDate(recordDate)} salvo.`, [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  }

  function confirmDelete() {
    if (activeCollaboratorId === null || recordDate === null) {
      return;
    }
    confirmDestructiveAction(
      'Excluir registro',
      `Tem certeza que deseja excluir o registro de ${formatDisplayDate(recordDate)}?`,
      () => {
        deleteRecord(activeCollaboratorId, recordDate);
        navigation.navigate('Home');
      }
    );
  }

  if (activeCollaboratorId === null) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <NoActiveCollaboratorState onNavigateToEquipe={() => navigation.navigate('Equipe')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title} accessibilityRole="header">
            Registro Diário
          </Text>

          <FormSection title="Data do registro" icon="calendar">
            <Pressable
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              accessibilityRole="button"
              accessibilityLabel={
                recordDate
                  ? `Data do registro: ${formatDisplayDate(recordDate)}. Toque para alterar.`
                  : 'Nenhuma data selecionada. Toque para selecionar uma data.'
              }
            >
              <Text style={recordDate ? styles.dateButtonText : styles.dateButtonPlaceholder}>
                {recordDate ? formatDisplayDate(recordDate) : 'Toque para escolher a data'}
              </Text>
            </Pressable>
            {showDatePicker ? (
              <DateTimePicker
                value={recordDate ? new Date(`${recordDate}T00:00:00`) : new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            ) : null}
            {dateMissingError ? (
              <Text style={styles.error} accessibilityRole="alert">
                Escolha uma data antes de salvar.
              </Text>
            ) : null}
          </FormSection>

          <FormSection title="Hidratação" icon="water">
            <LabeledTextInput
              label="Água consumida (ml)"
              keyboardType="numeric"
              value={values.waterMl}
              onChangeText={(text) => updateField('waterMl', text)}
              placeholder="Ex: 2000"
              accessibilityLabel="Quantidade de água consumida em mililitros"
              error={errors.waterMl}
            />
          </FormSection>

          <FormSection title="Sono" icon="bed">
            <LabeledTextInput
              label="Horas dormidas"
              keyboardType="numeric"
              value={values.sleepHours}
              onChangeText={(text) => updateField('sleepHours', text)}
              placeholder="Ex: 8"
              accessibilityLabel="Quantidade de horas dormidas"
              error={errors.sleepHours}
            />
          </FormSection>

          <FormSection title="Humor" icon="happy">
            <MoodSelector value={values.mood} onChange={(mood) => updateField('mood', mood)} />
            {errors.mood ? (
              <Text style={styles.error} accessibilityRole="alert">
                {errors.mood}
              </Text>
            ) : null}
          </FormSection>

          <FormSection title="Atividade Física" icon="barbell">
            <View style={styles.switchRow}>
              <Text style={styles.label}>Fez exercício hoje?</Text>
              <Switch
                value={values.exerciseDone}
                onValueChange={(value) => updateField('exerciseDone', value)}
                accessibilityLabel="Fez exercício hoje"
                accessibilityRole="switch"
                accessibilityState={{ checked: values.exerciseDone }}
              />
            </View>

            {values.exerciseDone ? (
              <>
                <Text style={styles.sublabel}>Tipo de exercício</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.exerciseType}
                    onValueChange={(itemValue) => updateField('exerciseType', String(itemValue))}
                    accessibilityLabel="Tipo de exercício"
                  >
                    {EXERCISE_TYPES.map((type) => (
                      <Picker.Item key={type} label={type} value={type} />
                    ))}
                  </Picker>
                </View>

                <LabeledTextInput
                  label="Duração (minutos)"
                  variant="sublabel"
                  keyboardType="numeric"
                  value={values.exerciseDurationMin}
                  onChangeText={(text) => updateField('exerciseDurationMin', text)}
                  placeholder="Ex: 30"
                  accessibilityLabel="Duração do exercício em minutos"
                  error={errors.exerciseDurationMin}
                />
              </>
            ) : null}
          </FormSection>

          <CustomButton label="Salvar registro" onPress={handleSubmit} accessibilityLabel="Salvar registro do dia" />

          {existingRecord ? (
            <CustomButton
              label="Excluir registro"
              variant="danger"
              onPress={confirmDelete}
              accessibilityLabel={`Excluir registro de ${recordDate ? formatDisplayDate(recordDate) : ''}`}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  sublabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  dateButtonPlaceholder: {
    fontSize: 16,
    color: colors.textMuted,
  },
});
