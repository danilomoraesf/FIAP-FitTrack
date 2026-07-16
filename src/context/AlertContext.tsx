import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { CustomButton } from '../components/CustomButton';

interface AlertButton {
  label: string;
  variant?: 'primary' | 'danger' | 'secondary';
  onPress?: () => void;
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
}

interface AlertContextValue {
  alert: (title: string, message: string, onDismiss?: () => void) => void;
  confirm: (title: string, message: string, onConfirm: () => void, confirmLabel?: string) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const initialState: AlertState = { visible: false, title: '', message: '', buttons: [] };

export function AlertProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlertState>(initialState);

  const close = useCallback(() => setState(initialState), []);

  const alert = useCallback<AlertContextValue['alert']>(
    (title, message, onDismiss) => {
      setState({
        visible: true,
        title,
        message,
        buttons: [
          {
            label: 'OK',
            variant: 'primary',
            onPress: () => {
              close();
              onDismiss?.();
            },
          },
        ],
      });
    },
    [close]
  );

  const confirm = useCallback<AlertContextValue['confirm']>(
    (title, message, onConfirm, confirmLabel = 'Confirmar') => {
      setState({
        visible: true,
        title,
        message,
        buttons: [
          { label: 'Cancelar', variant: 'secondary', onPress: close },
          {
            label: confirmLabel,
            variant: 'danger',
            onPress: () => {
              close();
              onConfirm();
            },
          },
        ],
      });
    },
    [close]
  );

  return (
    <AlertContext.Provider value={{ alert, confirm }}>
      {children}
      <Modal transparent visible={state.visible} onRequestClose={close}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>{state.title}</Text>
            <Text style={styles.message}>{state.message}</Text>
            <View style={styles.buttonRow}>
              {state.buttons.map((button) => (
                <View key={button.label} style={styles.buttonWrapper}>
                  <CustomButton
                    label={button.label}
                    variant={button.variant === 'primary' ? 'primary' : button.variant === 'danger' ? 'danger' : 'secondary'}
                    onPress={() => button.onPress?.()}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert precisa ser usado dentro de um AlertProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  message: {
    fontSize: 15,
    color: colors.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  buttonWrapper: {
    flex: 1,
  },
});
