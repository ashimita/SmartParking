/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.estuary.smartparking;

import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.ClientEndpoint;
import javax.websocket.CloseReason;
import javax.websocket.ContainerProvider;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;

/**
 *
 * @author ashimitaa
 */
@ClientEndpoint
public class ParkingClient {

    Session session = null;
    private MessageHandler messageHandler;

    public ParkingClient(URI uri) {
        try {
            WebSocketContainer container = ContainerProvider.getWebSocketContainer();
            container.connectToServer(this, uri);
        } catch (Exception e) {
            Logger.getLogger(ParkingClient.class.getName()).log(Level.SEVERE, null, e);
        }
    }

    @OnError
    public void processError(Throwable t) {
        t.printStackTrace();
    }
    
     @OnOpen
    public void onOpen(Session session) {
        this.session = session;
    }
    
    @OnClose
    public void onClose(Session session, CloseReason reason) {
        this.session = null;
    }
    
    @OnMessage
    public void onMessage(String message) {
        if(this.messageHandler != null) {
            this.messageHandler.handleMessage(message);
        }
    }
    
    public void addMessageHandler(MessageHandler msgHandler) {
        this.messageHandler = msgHandler;
    }
    
    public void sendMessage(String message) {
        this.session.getAsyncRemote().sendText(message);
    }
    
    public static interface MessageHandler {
        public void handleMessage(String message);
    }
}
