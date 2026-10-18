#import <UIKit/UIKit.h>

extern "C" {

static UIViewController* GenesisRootViewController()
{
    UIWindow *window = nil;
    if (@available(iOS 13.0, *))
    {
        for (UIScene *scene in UIApplication.sharedApplication.connectedScenes)
        {
            if (scene.activationState != UISceneActivationStateForegroundActive) continue;
            if (![scene isKindOfClass:[UIWindowScene class]]) continue;
            UIWindowScene *windowScene = (UIWindowScene *)scene;
            for (UIWindow *w in windowScene.windows)
            {
                if (w.isKeyWindow) { window = w; break; }
            }
            if (window == nil && windowScene.windows.count > 0)
                window = windowScene.windows.firstObject;
            if (window != nil) break;
        }
    }
    if (window == nil)
        window = UIApplication.sharedApplication.keyWindow;
    return window.rootViewController;
}

/// Share image (optional) + text via UIActivityViewController. Returns 1 if presented.
int Genesis_ShareImageAndText(const char* imagePath, const char* text, const char* subject)
{
    @autoreleasepool
    {
        NSMutableArray *items = [NSMutableArray array];
        if (text != NULL && strlen(text) > 0)
            [items addObject:[NSString stringWithUTF8String:text]];

        if (imagePath != NULL && strlen(imagePath) > 0)
        {
            NSString *path = [NSString stringWithUTF8String:imagePath];
            if ([[NSFileManager defaultManager] fileExistsAtPath:path])
            {
                UIImage *image = [UIImage imageWithContentsOfFile:path];
                if (image != nil)
                    [items addObject:image];
                else
                    [items addObject:[NSURL fileURLWithPath:path]];
            }
        }

        if (items.count == 0)
            return 0;

        UIActivityViewController *activity =
            [[UIActivityViewController alloc] initWithActivityItems:items applicationActivities:nil];

        UIViewController *root = GenesisRootViewController();
        if (root == nil)
            return 0;

        // iPad popover anchor
        if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
        {
            activity.popoverPresentationController.sourceView = root.view;
            activity.popoverPresentationController.sourceRect =
                CGRectMake(CGRectGetMidX(root.view.bounds), CGRectGetMidY(root.view.bounds), 1, 1);
            activity.popoverPresentationController.permittedArrowDirections = 0;
        }

        [root presentViewController:activity animated:YES completion:nil];
        return 1;
    }
}

}
