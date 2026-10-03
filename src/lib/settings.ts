import { connectToDatabase } from "@/lib/mongodb";
import SystemSetting from "@/models/SystemSetting";
import { isPassRegistrationClosed as isTimestampClosed, PASS_CLOSED_MESSAGE } from "@/lib/passConfig";

export interface RegistrationStatus {
  isClosed: boolean;
  message: string;
  stoppedByAdmin: boolean;
  updatedAt?: Date;
}

export async function getRegistrationStatus(): Promise<RegistrationStatus> {
  try {
    await connectToDatabase();
    const setting: any = await SystemSetting.findOne({ key: "registration_toggle" }).lean();
    
    if (setting && setting.value) {
      const isStoppedByAdmin = !!setting.value.isClosed;
      const isClosed = isStoppedByAdmin || isTimestampClosed();
      return {
        isClosed,
        stoppedByAdmin: isStoppedByAdmin,
        message: setting.value.message || PASS_CLOSED_MESSAGE.description,
        updatedAt: setting.updatedAt,
      };
    }
  } catch (err) {
    console.error("Error reading registration setting from DB:", err);
  }

  // Fallback to timestamp check
  const fallbackClosed = isTimestampClosed();
  return {
    isClosed: fallbackClosed,
    stoppedByAdmin: false,
    message: PASS_CLOSED_MESSAGE.description,
  };
}

export async function setRegistrationStatus(
  isClosed: boolean,
  message?: string
): Promise<boolean> {
  try {
    await connectToDatabase();
    await SystemSetting.findOneAndUpdate(
      { key: "registration_toggle" },
      {
        value: {
          isClosed,
          message: message || (isClosed ? "Registrations have been closed by the administration." : "Registrations are open."),
        },
      },
      { upsert: true, new: true }
    );
    return true;
  } catch (err) {
    console.error("Error writing registration setting to DB:", err);
    return false;
  }
}
