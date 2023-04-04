import { User } from "./models/users.js";
import { config } from "./config.js";

const adminSub = config.adminSub;

export const initAdmin = async function () {
  const existingAdmin = await User.findOne({ sub: adminSub });
  if (!existingAdmin) {
    const admin = new User({
      sub: adminSub,
      displayName: "admin",
      email: "admin@localhost.loc",
      claims: [],
      isAdmin: true,
    });
    await admin.save();
  } else {
    existingAdmin.sub = adminSub;
    existingAdmin.displayName = "admin";
    existingAdmin.email = "admin@localhost.loc";
    existingAdmin.claims = [];
    existingAdmin.isAdmin = true;
    await existingAdmin.save();
  }
};
