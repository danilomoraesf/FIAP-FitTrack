import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyRecordCard } from '../components/DailyRecordCard';
import { NoActiveCollaboratorState } from '../components/NoActiveCollaboratorState';
import { useCollaborators } from '../context/useCollaborators';
import { useRecords } from '../context/useRecords';
import { getRecordsForCollaborator, makeRecordKey, sortRecordsDescending } from '../domain/records';
import { DailyRecord } from '../models/DailyRecord';
import { RootTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { confirmDestructiveAction } from '../utils/confirm';
import { formatDisplayDate } from '../utils/date';

type Props = BottomTabScreenProps<RootTabParamList, 'Historico'>;

export function HistoryScreen({ navigation }: Props) {
  const { state, deleteRecord } = useRecords();
  const { state: collaboratorsState } = useCollaborators();

  if (collaboratorsState.activeCollaboratorId === null) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <NoActiveCollaboratorState onNavigateToEquipe={() => navigation.navigate('Equipe')} />
      </SafeAreaView>
    );
  }

  const activeCollaboratorId = collaboratorsState.activeCollaboratorId;
  const records = sortRecordsDescending(getRecordsForCollaborator(state.records, activeCollaboratorId));

  function confirmDelete(record: DailyRecord) {
    confirmDestructiveAction(
      'Excluir registro',
      `Tem certeza que deseja excluir o registro de ${formatDisplayDate(record.date)}?`,
      () => deleteRecord(record.collaboratorId, record.date)
    );
  }

  function renderItem({ item }: { item: DailyRecord }) {
    return (
      <DailyRecordCard
        record={item}
        onPress={() => navigation.navigate('Registro', { date: item.date })}
        onDelete={() => confirmDelete(item)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Histórico
        </Text>
      </View>
      <FlatList
        data={records}
        keyExtractor={(item) => makeRecordKey(item.collaboratorId, item.date)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ainda não tem nada por aqui. Que tal registrar o dia de hoje?</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  list: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
