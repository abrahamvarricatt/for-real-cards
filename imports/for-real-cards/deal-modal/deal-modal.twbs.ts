/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input } from '@angular/core';

import { ModalService } from '../../common-app';

import {DealModalBase} from "./deal-modal-base";

import template from "./deal-modal.twbs.html";

@Component(
  {
    selector: 'frc-deal-modal',
    providers: [ModalService],
    template: template
  }
)
export class DealModal extends DealModalBase {
  @Input() componentParameters:any;
  constructor() {
    super();
  }
}
