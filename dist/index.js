"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
// instantiation of Express object and setting up an initial port.
const app = (0, express_1.default)();
const port = 3000;
app.use('/api', express_1.default.json(), index_1.default);
app.get('/', (_, res) => {
    res.status(200);
});
// App port check.
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
exports.default = app;
