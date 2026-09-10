#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativeAmaModule, RCTEventEmitter)

RCT_EXTERN_METHOD(start:(NSDictionary *)options)

RCT_EXTERN_METHOD(stop)

RCT_EXTERN_METHOD(
  highlight:(nonnull NSNumber *)viewId
  mode:(NSString *)mode
  hexColor:(NSString *)hexColor
  issueCount:(nonnull NSNumber *)issueCount
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(clearHighlight:(nonnull NSNumber *)viewId)

@end
