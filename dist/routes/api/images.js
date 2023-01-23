"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils = __importStar(require("../../utils/utils"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const images = express_1.default.Router();
images.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if all parameters are correct.
    const paramsCheck = utils.paramValidator(req);
    if (!paramsCheck[0]) {
        res.status(400).send(paramsCheck[1]);
        return;
    }
    //query parameters
    const filename = req.query['file_name'];
    const width = parseInt(req.query['width']);
    const height = parseInt(req.query['height']);
    //get image path from the query.
    const imagePath = `${path_1.default.resolve(__dirname, `../../../assets/images/${filename}.jpg`)}`;
    //check if image exists.
    const fullImage = yield promises_1.default.stat(imagePath).catch(() => {
        res.status(404).send('Image does not exist');
        return null;
    });
    if (!fullImage) {
        return;
    }
    //get resized image path to check if it is already created.
    const resizedImagePath = `${path_1.default.resolve(__dirname, `../../../assets/resized_images/${filename}${height}h${width}w.jpg`)}`;
    //check if resized image already created
    const resizedImage = yield promises_1.default
        .stat(resizedImagePath)
        .catch(() => {
        return null;
    });
    //return resized image directly if exists
    // if not, resize it then return it.
    if (resizedImage) {
        promises_1.default.readFile(resizedImagePath)
            .then((imageBuffer) => {
            res.status(200).contentType('jpg').send(imageBuffer);
        })
            .catch(() => {
            res.status(500).send('Error occured while returning resized image');
        });
    }
    else {
        // resize image
        utils
            .resizeImage({
            imagePath,
            resizedImagePath,
            width,
            height,
        })
            .then((resizedImage) => {
            res.status(200).contentType('jpg').send(resizedImage);
        })
            .catch(() => {
            res.status(500).send('Error occured while resizing the image');
        });
    }
}));
exports.default = images;
