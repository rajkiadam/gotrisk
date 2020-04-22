import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from '../game.service';

@Component({
  selector: 'app-modal-basic',
  templateUrl: './modal-basic.component.html',
  styleUrls: ['./modal-basic.component.css']
})
/**
 * Number selector component (TODO rename, test)
 */
export class ModalBasicComponent {
  // result after modal closing
  closeResult = '';

  // input field value
  inputValue: number = 1

  /**
   * Ctor
   * @param modalService service for the Modal
   * @param gameService service for event creation on number selection
   */
  constructor(private modalService: NgbModal, private gameService: GameService) {}

  // self defined component content
  @ViewChild('content') template: TemplateRef<any>

  /**
   * Opening the modal box
   * Handling close result, and raise event spreading the selected number
   */
  open() {
    this.modalService.open(this.template, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.gameService.setSelectedNumber(this.inputValue)      
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.gameService.setSelectedNumber(0)
    });
  }

  /**
   * Gives information on the reason of modal closing
   * @param reason closing reason
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}