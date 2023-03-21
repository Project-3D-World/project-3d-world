import AdmZip from "adm-zip";
import gltfValidator from "gltf-validator";
import fs from "fs";
import mongoose from "mongoose";

// TODO: reformat the errors

// util method to validate multi-file gltf in a zip
export const validateGltfZip = async (zipFile) => {
  let zip;
  try {
    zip = new AdmZip(zipFile);
  } catch (err) {
    throw new Error("Invalid zip file");
  }

  const zipEntries = zip.getEntries();
  const gltfEntry = zipEntries.find((entry) =>
    entry.entryName.endsWith(".gltf")
  );
  if (!gltfEntry) {
    throw new Error("No .gltf file found in zip");
  }

  const gltfBuffer = zip.readFile(gltfEntry);
  // Validate the loaded glTF file and its associated assets
  const result = await gltfValidator.validateBytes(gltfBuffer, {
    externalResourceFunction: (uri) => {
      const externEntry = zipEntries.find((entry) =>
        entry.entryName.endsWith(uri)
      );
      if (!externEntry) {
        throw new Error(`External resource ${uri} not found in zip file`);
      }
      return Promise.resolve(zip.readFile(externEntry));
    },
  });
  if (result.issues.numErrors > 0) {
    throw new Error(
      `GLTF validation failed with ${result.issues.numErrors} errors`
    );
  }
};

export const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

export const validateIds = (ids) => {
  for (const id of ids) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
  }
  return true;
};
