import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CollaboratorPicker } from '../components/CollaboratorPicker';
import { CustomButton } from '../components/CustomButton';
import { DailyRecordCard } from '../components/DailyRecordCard';
import { NoActiveCollaboratorState } from '../components/NoActiveCollaboratorState';
import { useCollaborators } from '../context/useCollaborators';
import { useRecords } from '../context/useRecords';
import { sortCollaboratorsByName } from '../domain/collaborators';
import { getRecordForCollaboratorDate } from '../domain/records';
import { RootTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { getTodayKey } from '../utils/date';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { state: recordsState } = useRecords();
  const { state: collaboratorsState, setActiveCollaborator } = useCollaborators();
  const todayKey = getTodayKey();

  if (collaboratorsState.activeCollaboratorId === null) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <NoActiveCollaboratorState onNavigateToEquipe={() => navigation.navigate('Equipe')} />
      </SafeAreaView>
    );
  }

  const activeCollaboratorId = collaboratorsState.activeCollaboratorId;
  const todayRecord = getRecordForCollaboratorDate(recordsState.records, activeCollaboratorId, todayKey);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          FitTrack
        </Text>

        <CollaboratorPicker
          collaborators={sortCollaboratorsByName(collaboratorsState.collaborators)}
          activeCollaboratorId={activeCollaboratorId}
          onChange={setActiveCollaborator}
        />

        <Text style={styles.subtitle}>Como foi hoje</Text>

        {todayRecord ? (
          <DailyRecordCard record={todayRecord} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Esse colaborador ainda não registrou nada hoje.
            </Text>
          </View>
        )}

        <View style={styles.buttonWrapper}>
          <CustomButton
            label={todayRecord ? 'Editar registro de hoje' : 'Registrar hoje'}
            onPress={() => navigation.navigate('Registro', { date: todayKey })}
            accessibilityLabel={todayRecord ? 'Editar registro de hoje' : 'Registrar hábitos de hoje'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
  },
  emptyState: {
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: spacing.sm,
  },
});
