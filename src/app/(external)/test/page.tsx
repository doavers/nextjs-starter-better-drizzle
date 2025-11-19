import ContactUsEmail from "@/components/emails/contact-us-email";

export default function TestPage() {
  return (
    <ContactUsEmail name="test" subject="Web Development" phone="0828282" email="email@email.com" message="Percobaan" />
  );
}
