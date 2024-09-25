/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { WormHoleControllerService } from './services/worm-hole-controller.service';
import { WarControllerService } from './services/war-controller.service';
import { WarRaidControllerService } from './services/war-raid-controller.service';
import { WarEnemyControllerService } from './services/war-enemy-controller.service';
import { WarBattleControllerService } from './services/war-battle-controller.service';
import { AdminControllerService } from './services/admin-controller.service';
import { UserControllerService } from './services/user-controller.service';
import { TechTreeControllerService } from './services/tech-tree-controller.service';
import { RoutingControllerService } from './services/routing-controller.service';
import { PlanetControllerService } from './services/planet-controller.service';
import { OrderControllerService } from './services/order-controller.service';
import { GvgControllerService } from './services/gvg-controller.service';
import { CreepControllerService } from './services/creep-controller.service';
import { ChassisControllerService } from './services/chassis-controller.service';
import { AtomicClockControllerService } from './services/atomic-clock-controller.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    WormHoleControllerService,
    WarControllerService,
    WarRaidControllerService,
    WarEnemyControllerService,
    WarBattleControllerService,
    AdminControllerService,
    UserControllerService,
    TechTreeControllerService,
    RoutingControllerService,
    PlanetControllerService,
    OrderControllerService,
    GvgControllerService,
    CreepControllerService,
    ChassisControllerService,
    AtomicClockControllerService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
