import { Alert } from 'react-native';

export function confirmDestructiveAction(
  title: string,
  message: string,
  onConfirm: () => void,
  confirmLabel: string = 'Excluir'
): void {
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
