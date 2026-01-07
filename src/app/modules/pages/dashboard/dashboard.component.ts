import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from "primeng/api";
import { CommentsService } from 'src/app/campaigns/service/comments.service';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from 'src/app/campaigns/service/users.service';
import { ProposalsService } from 'src/app/campaigns/service/proposals.service';

@Component({
  providers: [MessageService, ConfirmationService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  basicData: any;
  wait = true;
  basicOptions: any;
  subscriptions: Subscription[] = [];
  comments: Comment[] = [];
  loading = false;
  textColor: any;
  textColorSecondary: any;
  surfaceBorder: any;
  labels: string[] = [];
  dataCounts: number[] = [];
  monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  nComments: number = 0;
  nUsers: number = 0;
  nProposals: number = 0;
  constructor(
    private commentsService: CommentsService,
    private proposalService: ProposalsService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}
  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    this.textColor = documentStyle.getPropertyValue('--text-color');
    this.textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    this.surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.getCommets()
    this.getData() 
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async getCommets() {
   this.loading = true;
     this.subscriptions.push(
       this.commentsService.getComments()
         .pipe(
           catchError(err => {
             this.messageService.add({
               severity: 'error',
               summary: 'Error',
               detail: 'No se pudieron cargar los comentarios de Firebase.'
             });
             return of([]);
           })
         )
         .subscribe(comments => {
           const groupedByMonth: any = {};
           comments.forEach((item : any) => {
             const timestamp = item.createdAt.seconds;
             const monthYear = this.convertTimestampToDate(timestamp);
             if (!groupedByMonth[monthYear]) {
               groupedByMonth[monthYear] = [];
             }
             groupedByMonth[monthYear].push(item);
           });
           this.labels = Object.keys(groupedByMonth).sort((a, b) => this.monthNames.indexOf(a) - this.monthNames.indexOf(b));;
           this.dataCounts = this.labels.map((month) => groupedByMonth[month].length);
           this.createChart()
           this.nComments = comments.length;
           this.loading = false;
           
         })
     );
  }

  async getData() {
    this.wait = true;
    const usuariosData = await this.userService.getUsers();
    this.nUsers = usuariosData.length;
    const data = await this.proposalService.getProposal();
    this.nProposals = data.length;
    this.wait = false;
  }
 convertTimestampToDate(seconds: number): string {
  const date = new Date(seconds * 1000); 
   const month = this.monthNames[date.getMonth()];
  // Convertir segundos a milisegundos
   return `${month}`; // 'YYYY-MM'
}
  createChart() {
    this.basicData = {
      labels: this.labels, // Meses agrupados
      datasets: [
        {
          label: 'Comentarios por Mes 2025', // Cambia el label según el tipo de dato
          data: this.dataCounts, // Los conteos de mensajes por mes
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: this.textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  getTimestamp(date: any): number {
    if (date?.toDate) {
      return date.toDate().getTime();
    } else if (date instanceof Date) {
      return date.getTime();
    }
    return Date.now();
  }
}
