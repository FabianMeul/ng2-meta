import { Inject, Injectable } from '@angular/core';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { META_CONFIG } from './meta.module';
var isDefined = function (val) { return typeof val !== 'undefined'; };
export var MetaService = (function () {
    function MetaService(router, document, titleService, activatedRoute, metaConfig) {
        var _this = this;
        this.router = router;
        this.document = document;
        this.titleService = titleService;
        this.activatedRoute = activatedRoute;
        this.metaConfig = metaConfig;
        this.router.events
            .filter(function (event) { return (event instanceof NavigationEnd); })
            .map(function () { return _this._findLastChild(_this.activatedRoute); })
            .subscribe(function (routeData) {
            _this._updateMetaTags(routeData.meta);
        });
    }
    MetaService.prototype._findLastChild = function (activatedRoute) {
        var snapshot = activatedRoute.snapshot;
        var child = snapshot.firstChild;
        while (child.firstChild !== null) {
            child = child.firstChild;
        }
        return child.data;
    };
    MetaService.prototype._getOrCreateMetaTag = function (name) {
        var el = this.document.querySelector("meta[name='" + name + "']");
        if (!el) {
            el = this.document.createElement('meta');
            el.setAttribute('name', name);
            this.document.head.appendChild(el);
        }
        return el;
    };
    MetaService.prototype._updateMetaTags = function (meta) {
        var _this = this;
        if (meta === void 0) { meta = {}; }
        if (meta.disableUpdate) {
            return false;
        }
        this.setTitle(meta.title, meta.titleSuffix);
        Object.keys(meta).forEach(function (key) {
            if (key === 'title' || key === 'titleSuffix') {
                return;
            }
            _this.setTag(key, meta[key]);
        });
        Object.keys(this.metaConfig.defaults).forEach(function (key) {
            if (key in meta || key === 'title' || key === 'titleSuffix') {
                return;
            }
            _this.setTag(key, _this.metaConfig.defaults[key]);
        });
    };
    MetaService.prototype.setTitle = function (title, titleSuffix) {
        var titleElement = this._getOrCreateMetaTag('title');
        var ogTitleElement = this._getOrCreateMetaTag('og:title');
        var titleStr = isDefined(title) ? title : (this.metaConfig.defaults['title'] || '');
        if (this.metaConfig.useTitleSuffix) {
            titleStr += isDefined(titleSuffix) ? titleSuffix : (this.metaConfig.defaults['titleSuffix'] || '');
        }
        titleElement.setAttribute('content', titleStr);
        ogTitleElement.setAttribute('content', titleStr);
        this.titleService.setTitle(titleStr);
        return this;
    };
    MetaService.prototype.setTag = function (tag, value) {
        if (tag === 'title' || tag === 'titleSuffix') {
            throw new Error("Attempt to set " + tag + " through 'setTag': 'title' and 'titleSuffix' are reserved tag names.\n      Please use 'MetaService.setTitle' instead");
        }
        var tagElement = this._getOrCreateMetaTag(tag);
        var tagStr = isDefined(value) ? value : (this.metaConfig.defaults[tag] || '');
        tagElement.setAttribute('content', tagStr);
        if (tag === 'description') {
            var ogDescElement = this._getOrCreateMetaTag('og:description');
            ogDescElement.setAttribute('content', tagStr);
        }
        return this;
    };
    MetaService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    MetaService.ctorParameters = function () { return [
        { type: Router, },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
        { type: Title, },
        { type: ActivatedRoute, },
        { type: undefined, decorators: [{ type: Inject, args: [META_CONFIG,] },] },
    ]; };
    return MetaService;
}());
//# sourceMappingURL=meta.service.js.map