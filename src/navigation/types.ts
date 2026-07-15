import { NavigatorScreenParams } from '@react-navigation/native';

export type EquipeStackParamList = {
  ColaboradoresList: undefined;
  ColaboradorForm: { collaboratorId?: string } | undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Registro: { date?: string } | undefined;
  Historico: undefined;
  Equipe: NavigatorScreenParams<EquipeStackParamList> | undefined;
};
