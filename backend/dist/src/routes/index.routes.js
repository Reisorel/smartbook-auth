"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const book_routes_1 = __importDefault(require("./book.routes"));
const cart_routes_1 = __importDefault(require("./cart.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const router = (0, express_1.Router)();
// Préfixe toutes les routes avec leur domaine fonctionnel
router.use('/auth', auth_routes_1.default);
router.use('/books', book_routes_1.default);
router.use('/cart', cart_routes_1.default);
router.use('/users', user_routes_1.default);
exports.default = router;
