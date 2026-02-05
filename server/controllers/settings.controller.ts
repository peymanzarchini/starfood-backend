import { Request, Response, NextFunction } from "express";
import { settingsService } from "../services/settings.service.js";

class SettingsController {
  async getAllSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.getAllSettings();
      res.success("Settings retrieved successfully", settings);
    } catch (error) {
      next(error);
    }
  }

  async updateSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key } = req.params;
      const { value } = req.body;

      const setting = await settingsService.updateSetting(key, value);
      res.success("Setting updated successfully", setting);
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
