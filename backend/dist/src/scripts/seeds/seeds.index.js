"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBooks = exports.seedClient = exports.seedAdmin = void 0;
const seeds_admins_1 = require("./seeds.admins");
Object.defineProperty(exports, "seedAdmin", { enumerable: true, get: function () { return seeds_admins_1.seedAdmin; } });
const seeds_clients_1 = require("./seeds.clients");
Object.defineProperty(exports, "seedClient", { enumerable: true, get: function () { return seeds_clients_1.seedClient; } });
const seeds_books_1 = require("./seeds.books");
Object.defineProperty(exports, "seedBooks", { enumerable: true, get: function () { return seeds_books_1.seedBooks; } });
