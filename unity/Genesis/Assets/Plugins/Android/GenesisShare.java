package com.bilalashraf.genesis;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.FileProvider;
import java.io.File;

/**
 * Native Android share helper for Genesis share cards (image + text).
 * Uses FileProvider so receiving apps can read the PNG on Android 7+.
 */
public final class GenesisShare {
    private GenesisShare() {}

    public static boolean shareImageAndText(Activity activity, String imagePath, String text, String subject) {
        if (activity == null) return false;
        try {
            Intent intent = new Intent(Intent.ACTION_SEND);
            boolean hasImage = imagePath != null && imagePath.length() > 0;
            File file = hasImage ? new File(imagePath) : null;
            if (file != null && file.exists()) {
                intent.setType("image/png");
                String authority = activity.getPackageName() + ".genesis.fileprovider";
                Uri uri = FileProvider.getUriForFile(activity, authority, file);
                intent.putExtra(Intent.EXTRA_STREAM, uri);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    intent.setClipData(android.content.ClipData.newRawUri("", uri));
                }
            } else {
                intent.setType("text/plain");
            }

            if (subject != null && subject.length() > 0)
                intent.putExtra(Intent.EXTRA_SUBJECT, subject);
            if (text != null && text.length() > 0)
                intent.putExtra(Intent.EXTRA_TEXT, text);

            Intent chooser = Intent.createChooser(intent, "Share via");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(chooser);
            return true;
        } catch (Exception e) {
            android.util.Log.w("GenesisShare", "share failed: " + e.getMessage());
            return false;
        }
    }
}
