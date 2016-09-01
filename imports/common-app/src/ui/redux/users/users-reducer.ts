///<reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');
import { IPayloadAction } from '../action.interface';
import { UsersActions } from './users-actions.class';
import {IUsersActionPayload, IUsersState  } from './users.types'
import {BaseApp} from "../base-app.class";
import {User} from "../../../../../common-app-api/";
import {IDocumentChange, EDocumentChangeType} from "../../reactive-data/document-change.interface";

const INITIAL_STATE:IUsersState = {
  users: Immutable.Map<string, User>()
};

export function usersReducer(
  state: IUsersState = INITIAL_STATE,
  action: IPayloadAction): IUsersState
{

  let payload:IUsersActionPayload = action.payload;
  switch (action.type) {
    case UsersActions.READ_BATCH_RESPONSE:
      return {users: BaseApp.arrayToMap<User>(payload.users) };
    case UsersActions.CHANGE:
      let changeDoc:IDocumentChange<User>=payload.documentChange;
      switch (changeDoc.changeType) {
        case (EDocumentChangeType.NEW): // Fall through
        case (EDocumentChangeType.CHANGED):
          return {users: state.users.set(changeDoc.newDocument._id, changeDoc.newDocument) };
        case (EDocumentChangeType.REMOVED):
          return {users: state.users.delete(changeDoc.newDocument._id) };
        default:
          return state;
      }
    default:
      return state;
  }
}

