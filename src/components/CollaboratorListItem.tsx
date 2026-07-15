import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Collaborator } from '../models/Collaborator';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { Card } from './Card';

interface CollaboratorListItemProps {
  collaborator: Collaborator;
  isActive: boolean;
  onPress: () => void;
  onDelete: () => void;
}

export function CollaboratorListItem({ collaborator, isActive, onPress, onDelete }: CollaboratorListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Editar colaborador ${collaborator.name}${isActive ? ', ativo no momento' : ''}`}
      accessibilityState={{ selected: isActive }}
    >
      <Card style={styles.row}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{collaborator.name}</Text>
            {isActive ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Ativo</Text>
              </View>
            ) : null}
          </View>
          {collaborator.role ? <Text style={styles.role}>{collaborator.role}</Text> : null}
        </View>
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Excluir colaborador ${collaborator.name}`}
          hitSlop={8}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  role: {
    fontSize: 13,
    color: colors.textMuted,
  },
  badge: {
    backgroundColor: colors.successBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 11,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});
