<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Composer autoload
require __DIR__ . '/../vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $receiving_email_address = "basillal1010@gmail.com"; // <-- YOUR receiving email

    $name    = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : '';
    $email   = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : '';
    $subject = isset($_POST["subject"]) ? strip_tags(trim($_POST["subject"])) : 'Contact Form Message';
    $message = isset($_POST["message"]) ? trim($_POST["message"]) : '';

    if (empty($name) || empty($email) || empty($message)) {
        echo "Please fill all required fields.";
        exit;
    }

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();

        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'basillal1010@gmail.com';    // <-- Your Gmail address
        $mail->Password   = 'mfzb izse cxrt svcv';           // <-- Gmail App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('22mcaa12@kristujayanti.com', 'Website Contact');
        $mail->addAddress($receiving_email_address);
        $mail->addReplyTo($email, $name);

        $mail->Subject = $subject;
        $mail->Body    = "Name: $name\nEmail: $email\n\nMessage:\n$message";
        $mail->AltBody = $mail->Body;

        if ($mail->send()) {
            echo "OK";
        }

    } catch (Exception $e) {
        echo "Failed to send message: " . $mail->ErrorInfo;
    }

} else {
    echo "Invalid request.";
}
?>