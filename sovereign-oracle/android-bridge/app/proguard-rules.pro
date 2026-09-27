# Retain data models sent over WebSocket
-keepclassmembers class com.oracle.bridge.models.** { *; }
-keep class com.oracle.bridge.models.** { *; }
# Keep QuickJS / FileObserver native hooks
-keepclasseswithmembernames class * { native <methods>; }
