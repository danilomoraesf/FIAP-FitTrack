# FitTrack

App mobile para uma equipe de RH acompanhar hábitos de saúde dos colaboradores no dia a dia: água, sono, humor e exercício. Feito em React Native (Expo) para o projeto de pós-graduação em Engenharia Front-end.

## Stack

- React Native com Expo (managed workflow), SDK 54
- TypeScript
- React Navigation (Bottom Tabs + uma Stack aninhada) pra navegação entre telas
- Context API + useReducer pro estado
- AsyncStorage pra persistência local no aparelho

## Como rodar

```bash
npm install
npx expo start
```

Abre o Expo Go no celular (na mesma rede Wi-Fi do PC) e escaneia o QR code que aparece no terminal, ou digita a URL manualmente (`exp://<seu-ip-local>:8081`).

## Telas

1. **Início** — mostra o colaborador ativo no momento, um resumo do dia dele (água, sono, exercício, quantas metas já bateu) e um botão pra registrar ou editar o dia.
2. **Registro** — formulário pra lançar os hábitos de um dia: data (dá pra escolher dias anteriores, não futuros), água em ml, horas de sono, humor de 1 a 5 (emojis), se fez exercício e qual tipo/duração. Tem validação nos campos.
3. **Histórico** — lista os registros do colaborador ativo, destacando os dias em que todas as metas foram batidas. Dá pra tocar num registro pra editar, ou apagar pelo ícone de lixeira.
4. **Equipe** — CRUD de colaboradores (nome + cargo, que é opcional): listar, cadastrar, editar, excluir. Não tem login, é pensado pra um único operador de RH gerenciando vários perfis no mesmo aparelho.

## Arquitetura

O `src/` é dividido em camadas, cada uma dependendo só das anteriores:

```
src/
  models/       tipos e constantes (DailyRecord, Collaborator, metas fixas)
  domain/       funções puras: progresso, metas atingidas, validação, colaborador ativo
  storage/      leitura/escrita no AsyncStorage
  context/      estado global (reducers + Providers + hooks useRecords/useCollaborators)
  theme/        cor e espaçamento
  components/   componentes reutilizáveis de UI
  screens/      telas do app
  navigation/   Bottom Tabs + Stack aninhada da aba Equipe
```

`App.tsx` só monta os providers e o navigator, sem lógica de negócio.

### Por que dividi assim

`domain/` não importa nada de React Native nem AsyncStorage — é só lógica pura (cálculo de progresso, metas, validação de formulário, resolução do colaborador ativo, checagem de data duplicada ao editar um registro). Isso deixa a regra de negócio isolada da parte visual.

`context/` isola o estado da UI: as telas usam os hooks `useRecords()`/`useCollaborators()` e nunca tocam no AsyncStorage direto. São dois contexts separados (registros e colaboradores) pra não acoplar um no outro.

`storage/` embrulha a persistência em funções simples de load/save, uma chave por entidade, tudo serializado em JSON.

Pra navegação, usei Bottom Tabs pras 4 áreas principais (Início, Registro, Histórico, Equipe) e uma Stack aninhada dentro de Equipe (lista → formulário), pra ter o header e o gesto de voltar nativos.

### Componentes reutilizáveis

`Card`, `CustomButton`, `MoodSelector`, `ProgressBar`, `DailyRecordCard`, `FormSection`, `CollaboratorListItem`, `CollaboratorPicker`, `NoActiveCollaboratorState`. Todos com `accessibilityLabel`/`accessibilityRole` pra leitor de tela.

## Algumas decisões

- As metas diárias são fixas por enquanto (água 2000ml, sono 8h, exercício 30min), definidas em `src/models/Goals.ts` — não dá pra configurar pelo app ainda.
- O projeto começou no SDK 57 do Expo, mas precisei rebaixar pro SDK 54 porque o Expo Go instalado no celular que eu testava não acompanhava a versão mais nova.
- Só existe um "colaborador ativo" por vez (trocado num dropdown na Início), e é ele que escopa Registro e Histórico. Não tem uma visão agregada de todos os colaboradores ainda.
- Cada registro é indexado por `colaboradorId::data` (em `src/domain/records.ts`), pra colaboradores diferentes poderem ter registro no mesmo dia sem conflito.
- Quando vinculei os registros aos colaboradores, mudei a chave de armazenamento de `@fittrack/daily_records_v1` pra `@fittrack/daily_records_v2` — corte limpo, sem migrar os registros de teste que já existiam (não tinha como saber a qual colaborador atribuir cada um).
