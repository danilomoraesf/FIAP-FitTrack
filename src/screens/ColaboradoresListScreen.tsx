import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CollaboratorListItem } from '../components/CollaboratorListItem';
import { CustomButton } from '../components/CustomButton';
import { useCollaborators } from '../context/useCollaborators';
import { sortCollaboratorsByName } from '../domain/collaborators';
import { Collaborator } from '../models/Collaborator';
import { EquipeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { confirmDestructiveAction } from '../utils/confirm';

type Props = NativeStackScreenProps<EquipeStackParamList, 'ColaboradoresList'>;

export function ColaboradoresListScreen({ navigation }: Props) {
  const { state, deleteCollaborator } = useCollaborators();
  const collaborators = sortCollaboratorsByName(state.collaborators);

  function confirmDelete(collaborator: Collaborator) {
    confirmDestructiveAction(
      'Excluir colaborador',
      `Tem certeza que deseja excluir ${collaborator.name}? Os registros já salvos para este colaborador não serão apagados.`,
      () => deleteCollaborator(collaborator.id)
    );
  }

  function renderItem({ item }: { item: Collaborator }) {
    return (
      <CollaboratorListItem
        collaborator={item}
        isActive={item.id === state.activeCollaboratorId}
        onPress={() => navigation.navigate('ColaboradorForm', { collaboratorId: item.id })}
        onDelete={() => confirmDelete(item)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <FlatList
        data={collaborators}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ainda não tem colaborador cadastrado.</Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <CustomButton
          label="Novo colaborador"
          onPress={() => navigation.navigate('ColaboradorForm')}
          accessibilityLabel="Cadastrar novo colaborador"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    flexGrow: 1,
  },
  footer: {
    padding: spacing.md,
    paddingTop: 0,
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
