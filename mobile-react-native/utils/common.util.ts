import dayjs from "dayjs";
import React from "react";
import { useWindowDimensions } from "react-native";
import { Buffer } from 'buffer'

export const CommonUtil = {
  getDate: (date: string) => {
    return new Date(date).toUTCString;
  },
};
export const Helpers = {
  cloneDeep: (data: any) => {
    return JSON.parse(JSON.stringify(data));
  },
  convertToDate: (date: any) => {
    return dayjs(date).format('DD-MM-YYYY');
  },
  convertToDateTime: (date: any) => {
    return dayjs(date).format('HH:mm:ss DD-MM-YYYY');
  },
  arrayBufferToBase64(buffer: any) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary, 'binary').toString('base64');
  },
}