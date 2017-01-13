import { OpaqueToken, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaService } from './meta.service';
export var META_CONFIG = new OpaqueToken('meta config');
export var MetaModule = (function () {
    function MetaModule() {
    }
    MetaModule.forRoot = function (metaConfig) {
        if (metaConfig === void 0) { metaConfig = { useTitleSuffix: false, defaults: {} }; }
        return {
            ngModule: MetaModule,
            providers: [
                { provide: META_CONFIG, useValue: metaConfig },
                MetaService
            ]
        };
    };
    MetaModule.decorators = [
        { type: NgModule, args: [{
                    imports: [RouterModule]
                },] },
    ];
    /** @nocollapse */
    MetaModule.ctorParameters = function () { return []; };
    return MetaModule;
}());
//# sourceMappingURL=meta.module.js.map