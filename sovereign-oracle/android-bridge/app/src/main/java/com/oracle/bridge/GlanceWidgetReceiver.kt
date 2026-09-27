package com.oracle.bridge

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

// Glance widget receiver: surfaces nexus state on the home screen.
class GlanceWidgetReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        // Update Glance widget with latest NexusState snapshot.
    }
}
