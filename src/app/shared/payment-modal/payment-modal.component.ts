import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TransactionPayload } from "src/app/payments/interfaces/payment";
import { PaymentService } from "src/app/payments/services/payment.service";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
let cards = [
  // valid card
  {
    card_number: '1111111111111111',
    cvv: 789,
    expiry_date: '01/18',
  },
  // invalid card
  {
    card_number: '4111111111111234',
    cvv: 123,
    expiry_date: '01/20',
  },
];

@Component({
    selector: 'app-modal',
    templateUrl: './payment-modal.component.html',
    styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit{
  valid_card = '1111111111111111';
  cardList = [];
  paymentForm: FormGroup;
  bla;
    constructor(
        public dialogRef: MatDialogRef<PaymentModalComponent>,
        @Inject(MAT_DIALOG_DATA) private modalData: any,
        private paymentService: PaymentService,
        private fb: FormBuilder,
        private matDialog: MatDialog
    ){
    }
    ngOnInit(): void {
      this.cardList = cards
        this.paymentForm = this.fb.group({
          payment_value:[ '', [Validators.required]],
          payment_card:['', [Validators.required]],
          destination_user_id:[this.modalData.id],
          cvv:[''],
          expiry_date:['']
      })
    }
    getInfo(i){
       this.paymentForm.controls['payment_card'].setValue(cards[i].card_number)
       this.paymentForm.controls['cvv'].setValue(cards[i].cvv)
       this.paymentForm.controls['expiry_date'].setValue(cards[i].expiry_date)
    }
    onSubmit(){
      if(this.paymentForm.get('payment_card').value == this.valid_card){
        this.paymentService.payment(this.paymentForm.value).subscribe(
          success => {
            this.bla = true;
            const dialogConfig = new MatDialogConfig();
            dialogConfig.id = "success-modal.component";
            dialogConfig.data = {
              title: 'Recibo de pagamento',
              text: 'O pagamento foi concluido com sucesso'
            }
            const modalDialog = this.matDialog.open(SuccessModalComponent, dialogConfig);
          },
          err => {console.log(err)}
        )
      } else {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.id = "error-modal.component";
        dialogConfig.data = {
          title: 'Cartão inválido',
          text: 'O pagamento não foi concluido com sucesso, tente novamente selecionando um novo cartão'
        }
        const modalDialog = this.matDialog.open(ErrorModalComponent, dialogConfig);
      }
      console.log(this.paymentForm.value)
    }

    openModal(name: string, id:number){

    }

}