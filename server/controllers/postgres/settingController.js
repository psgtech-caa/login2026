const settingModel = require("../../models/postgres/settingModel");

const getSettings = async (req, res) => {
  const map = {
    payment_url: "https://events.psginstitutions.in/EMS/register/E5294158179",
    registration_amount: "150",
    contact_email: "login2026@psgtech.ac.in",
    contact_phone: "+91 81482 51567",
    show_winners: "false",
  };

  try {
    const settings = await settingModel.findAll();
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return res.json(map);
  } catch (error) {
    try { await settingModel.sync(); } catch (_) {}
    return res.json(map);
  }
};

const updateSettings = async (req, res) => {
  try {
    try { await settingModel.sync(); } catch (_) {}
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      const [setting] = await settingModel.findOrCreate({
        where: { key },
        defaults: { value: String(value) },
      });
      await setting.update({ value: String(value) });
    }
    return res.json({ message: "Settings updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update settings", error: error.message });
  }
};

module.exports = { getSettings, updateSettings };
