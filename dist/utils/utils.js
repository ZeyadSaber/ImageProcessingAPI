"use strict";
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
exports.paramValidator = exports.resizeImage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const sharp_1 = __importDefault(require("sharp"));
// check if all parameters are in the request;
const paramValidator = (request) => {
    try {
        if (!request.query.file_name &&
            !request.query.width &&
            !request.query.height) {
            return [true, 'INDEX'];
        }
        else if (!request.query.file_name) {
            return [false, 'File name is missing.'];
        }
        else if (!request.query.width) {
            return [false, 'File width is missing.'];
        }
        else if (!request.query.height) {
            return [false, 'File height is missing.'];
        }
        else {
            return [
                true,
                `${request.query.file_name}${request.query.width}${request.query.height}`,
            ];
        }
    }
    catch (err) {
        return [false, 'Error Occurred'];
    }
};
exports.paramValidator = paramValidator;
// resize image of given Image path and dimensions and saves it in resized images path.
// returns image buffer on success.
const resizeImage = ({ imagePath, resizedImagePath, width, height, }) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield promises_1.default.readFile(imagePath).catch(() => null);
    const imageBuffer = yield (0, sharp_1.default)(image)
        .resize(width, height)
        .toBuffer()
        .catch(() => null);
    if (!imageBuffer) {
        return Promise.reject();
    }
    return promises_1.default
        .writeFile(resizedImagePath, imageBuffer)
        .then(() => {
        return imageBuffer;
    })
        .catch(() => {
        return Promise.reject();
    });
});
exports.resizeImage = resizeImage;
