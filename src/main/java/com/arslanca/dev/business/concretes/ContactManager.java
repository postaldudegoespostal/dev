package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.abstracts.ContactService;
import com.arslanca.dev.business.requests.SendMailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactManager implements ContactService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String myEmail;

    @Override
    public void send(SendMailRequest sendMailRequest) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(myEmail);
        mailMessage.setTo(myEmail);

        mailMessage.setReplyTo(sendMailRequest.getSenderEmail());

        mailMessage.setSubject("Portfolyo İletişim: " + sendMailRequest.getSubject());

        String finalMessage = "Ziyaretçi: " + sendMailRequest.getSenderEmail() + "\n\n" +
                "Mesaj:\n" + sendMailRequest.getMessage();

        mailMessage.setText(finalMessage);

        javaMailSender.send(mailMessage);
    }
}
