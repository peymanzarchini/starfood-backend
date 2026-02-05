/* eslint-disable @typescript-eslint/no-explicit-any */
import { Settings } from "../models/index.js";
import { SettingsKeys } from "../models/settings.model.js";
import { HttpError } from "../utils/httpError.js";

class SettingsService {
  async getAllSettings() {
    const settings = await Settings.findAll();
    const settingsObj: Record<string, string> = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    return settingsObj;
  }

  async updateSetting(key: string, value: string) {
    if (!Object.values(SettingsKeys).includes(key as any)) {
      throw HttpError.badRequest("Invalid setting key");
    }

    const setting = await Settings.findOne({ where: { key } });
    if (!setting) {
      throw HttpError.notFound("Setting not found");
    }

    await setting.update({ value });
    return setting;
  }
}

export const settingsService = new SettingsService();
