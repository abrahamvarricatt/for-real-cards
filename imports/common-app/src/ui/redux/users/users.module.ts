import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import { usersReducer} from "./users-reducer";
import { UsersAsync} from "./users-async.class";
import {IAppState} from "../state.interface";
import {UsersActions} from "./users-actions.class";

@Injectable()
export class UsersModule extends ReduxModule<IAppState>  {
  reducer=usersReducer;

  constructor(private usersEpics:UsersAsync, public actions:UsersActions) {
    super();
    this.epics.push(usersEpics.watchUsers);
  }

  initialize():void {
    this.actions.watch();
  }
}