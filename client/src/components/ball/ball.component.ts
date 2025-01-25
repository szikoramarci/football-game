import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { GridService } from "../../services/grid/grid.service";
import { HexCoordinates } from "@szikoramarci/honeycomb-grid";
import { getBallPosition } from "../../stores/ball-position/ball-position.selector";
import { AnimateService } from "../../services/animate/animate.service";
import { BALL_TOKEN_RADIUS } from "../../constants";

@Component({
    selector: 'ball',
    standalone: true,
    templateUrl: './ball.component.html',
})
export class BallComponent implements OnInit, OnDestroy {

    @Output() onGraphicsChanged = new EventEmitter<Container>()
    
    graphics: Container = new Container();  

    ballMovementSubscription!: Subscription;

    constructor(
        private store: Store,
        private grid: GridService,
        private animate: AnimateService
    ) {}

    ngOnInit(): void { 
        this.generateBall();
        this.sendGraphics();        
        this.initPlayerPositionSubscription();       
    }

    initPlayerPositionSubscription() {        
        this.ballMovementSubscription = this.store.select(getBallPosition())
            .subscribe(position => {                               
                this.moveBall(position);
            })
    }

    moveBall(newCoordinates: HexCoordinates) {
        const hex = this.grid.getHex(newCoordinates);                
        if (hex) {            
            this.animate.move(this.graphics, hex)      
        }
    }

    async generateBall(){        

        const ballBase = new Graphics().circle(0, 0, BALL_TOKEN_RADIUS);  
        ballBase.fill('white');
        this.graphics.addChild(ballBase);

        const texture = await Assets.load('/football.png');
        const ballTexture = new Sprite(texture);
        ballTexture.width = BALL_TOKEN_RADIUS * 2;
        ballTexture.height = BALL_TOKEN_RADIUS * 2;
        ballTexture.x = BALL_TOKEN_RADIUS * -1;
        ballTexture.y = BALL_TOKEN_RADIUS * -1;
        this.graphics.addChild(ballTexture);
    }


    sendGraphics() {        
        this.onGraphicsChanged.emit(this.graphics);
    }

    ngOnDestroy(): void {
        this.graphics.destroy();
        this.ballMovementSubscription?.unsubscribe();
    }
}