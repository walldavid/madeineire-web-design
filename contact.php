<?php
// Contact form handler — sends via the server's local mail transport
// (PHP mail(), which Plesk routes through its configured sendmail/Postfix setup).
// TODO: confirm info@madeineire.com is a real mailbox in Plesk (Mail settings)
// so SPF/DKIM line up and messages don't get flagged as spoofed.

header('Content-Type: application/json; charset=UTF-8');

$recipient = 'info@madeineire.com';
$from_address = 'info@madeineire.com';

function respond($success, $message) {
    http_response_code($success ? 200 : 400);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

// Honeypot: bots tend to fill every field, humans never see this one.
if (!empty($_POST['company'])) {
    respond(true, 'Thanks — we\'ll be in touch soon.');
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    respond(false, 'Please fill in every field.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.');
}

// Strip anything that could be used for header injection.
$clean_name = preg_replace('/[\r\n]+/', ' ', $name);
$clean_email = preg_replace('/[\r\n]+/', ' ', $email);

$subject = 'New enquiry from ' . $clean_name . ' via madeineire.com';

$body = "You've received a new enquiry from the madeineire.com contact form.\n\n"
    . "Name: {$clean_name}\n"
    . "Email: {$clean_email}\n\n"
    . "Message:\n{$message}\n";

$headers = [
    'From: MadeinEire Web Design <' . $from_address . '>',
    'Reply-To: ' . $clean_name . ' <' . $clean_email . '>',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, "Thanks — we've got your message and will be in touch soon.");
} else {
    respond(false, 'Something went wrong sending your message — please email us directly instead.');
}
