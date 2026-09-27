package com.oracle.bridge.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import com.oracle.bridge.models.SensorPayload
import com.oracle.bridge.net.WebSocketClient
import com.google.gson.Gson

class AmbientPhotonicService : Service(), SensorEventListener {
    private lateinit var sensorManager: SensorManager
    private lateinit var wakeLock: PowerManager.WakeLock
    private lateinit var ws: WebSocketClient
    private var lux = 0f; private var cct = 6500f; private var pressure = 1013f
    private val gson = Gson()

    override fun onCreate() {
        super.onCreate()
        startForeground(1, buildNotification())
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT)?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        wakeLock = (getSystemService(POWER_SERVICE) as PowerManager)
            .newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "oracle:telemetry").apply { acquire() }
        ws = WebSocketClient(this)
        ws.connect()
    }

    override fun onSensorChanged(e: SensorEvent) {
        if (e.sensor.type == Sensor.TYPE_LIGHT) lux = e.values[0]
        emit()
    }

    override fun onAccuracyChanged(s: Sensor?, a: Int) {}

    private fun emit() {
        val payload = SensorPayload(
            ts = System.currentTimeMillis(), lux = lux, cct = cct,
            pressure = pressure, pressureThreshold = 80f,
            deviceId = Build.DEVICE, battery = 100
        )
        ws.send(gson.toJson(mapOf("type" to "sensor", "payload" to payload)))
    }

    private fun buildNotification(): Notification {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val ch = NotificationChannel("oracle", "Oracle Telemetry", NotificationManager.IMPORTANCE_LOW)
            (getSystemService(NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(ch)
        }
        return Notification.Builder(this, "oracle")
            .setContentTitle("Oracle Bridge")
            .setContentText("Streaming sensor telemetry")
            .setSmallIcon(android.R.drawable.ic_menu_info_details)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        if (wakeLock.isHeld) wakeLock.release()
        sensorManager.unregisterListener(this)
        ws.close()
        super.onDestroy()
    }
}
