package org.kimios.telemetry.system;

import org.kimios.kernel.controller.ISecurityController;
import org.kimios.kernel.index.controller.CustomThreadPoolExecutor;
import org.kimios.kernel.security.model.Session;
import org.kimios.telemetry.controller.CustomScheduledThreadPoolExecutor;
import org.kimios.telemetry.controller.ITelemetryController;
import org.kimios.telemetry.jobs.TelemetrySenderJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.*;

public class TelemetrySender implements Runnable {

    private static Logger logger = LoggerFactory.getLogger(TelemetrySender.class);

    private volatile boolean active = true;
    private static Thread thrc;
    private CustomScheduledThreadPoolExecutor customScheduledThreadPoolExecutor;

    private ITelemetryController telemetryController;
    private ISecurityController securityController;

    public ISecurityController getSecurityController() {
        return securityController;
    }

    public void setSecurityController(ISecurityController securityController,
                                      ITelemetryController telemetryController) {
        this.securityController = securityController;
        this.telemetryController = telemetryController;
    }

    public ITelemetryController getTelemetryController() {
        return telemetryController;
    }

    public void setTelemetryController(ITelemetryController telemetryController) {
        this.telemetryController = telemetryController;
    }

    public void startJob() {
        //Session session = this.securityController.startSession("admin", "kimios");
        //TelemetrySenderJob job = new TelemetrySenderJob(this.telemetryController, session);

        this.customScheduledThreadPoolExecutor = new CustomScheduledThreadPoolExecutor(1);
        //this.customScheduledThreadPoolExecutor.submit(job);

        synchronized (this) {
            thrc = new Thread(this, "Kimios Telemetry Sender");
            thrc.start();
        }
    }

    public void stopJob() {
        try {
            this.stop();
            thrc.join();
        } catch (Exception e) {
        }
        logger.info("Telemetry Sender stopped");
    }

    public void stop() {
        this.active = false;
    }

    @Override
    public void run() {
        Session session = this.securityController.startSession("admin", "kimios");
        //while (active) {
            try {
                if (active) {
                    logger.info("send telemetry data now");
                    TelemetrySenderJob job = new TelemetrySenderJob(this.telemetryController, session);
                    this.customScheduledThreadPoolExecutor.submit(job);
                    logger.info("just sent telemetry data");
                }
//                Thread.sleep(5000);
            } catch (Exception e) {
                this.stop();
                logger.info("Thread interrupted " + e.getMessage());
            }
        //}
    }
}
