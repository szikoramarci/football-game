import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from '../services/app/app.service';
import { BaseLayerService } from '../layers/base/base.layer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild('gameboard') gameBoard!: ElementRef;

  constructor(
    private app: AppService,
    private baseLayer: BaseLayerService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.app.init();
    this.appendGraphics()
    this.baseLayer.init(); 
  }

  appendGraphics(){
    this.gameBoard.nativeElement.appendChild(this.app.getCanvas());
  }

}
