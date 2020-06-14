/**
 * Created by fanqifeng on 16-12-1.
 */
'use strict';

import {majorControllerFunc} from "./majorProject.controller";
import {majorServiceFunc} from "./majorProject.service";

export function majorProjectModule(Angular) {
    const majorProjectModule = Angular.module('majorProject', []);
    majorControllerFunc(majorProjectModule);
    majorServiceFunc(majorProjectModule);
}