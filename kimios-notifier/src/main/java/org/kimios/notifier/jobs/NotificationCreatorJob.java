package org.kimios.notifier.jobs;

import org.kimios.kernel.jobs.JobImpl;
import org.kimios.kernel.security.model.Session;
import org.kimios.notifier.controller.INotifierController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

public class NotificationCreatorJob extends JobImpl<Integer> implements Runnable {

    private static Logger log = LoggerFactory.getLogger(NotificationCreatorJob.class);

    private INotifierController notifierController;

    public NotificationCreatorJob(INotifierController notifierController, Session session) {
        //generate task id
        super( UUID.randomUUID().toString() );

        this.notifierController = notifierController;
        this.setSession(session);
    }

    @Override
    public Integer execute() throws Exception {
        log.debug("Starting creating notifications");
        return this.notifierController.createNotifications(getUserSession());
    }

    @Override
    public void run() {
        try {
            log.info("creating notification(s)");
            Integer i = this.notifierController.createNotifications(getUserSession());
            log.info("created " + i + " notification(s)");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }
}
