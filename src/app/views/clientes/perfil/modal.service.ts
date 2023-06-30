import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  showModal: boolean = false;
  private _uploadNotifier = new EventEmitter<any>();

  constructor() {}

  get uploadNotifier(): EventEmitter<any> {
    return this._uploadNotifier;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
