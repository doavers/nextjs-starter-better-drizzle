import { Html, Head, Body, Container, Section, Text, Hr, Tailwind } from "@react-email/components";
import { getTranslations } from "next-intl/server";

interface ContactUsEmailProps {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactUsEmail = async (props: ContactUsEmailProps) => {
  const { name, email, phone, subject, message } = props;
  const t = await getTranslations("contact");
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
            <Section>
              <Text className="mt-0 mb-[16px] text-[24px] font-bold text-gray-900">Inquiry Regarding [{subject}]</Text>

              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-gray-700">Dear Admin Team,</Text>
              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-gray-700">
                I hope this message finds you well. My name is <strong>{name}</strong>, and I would like to inquire
                about <strong>{subject}</strong>.
              </Text>
              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-gray-700">
                <strong>Details:</strong>{" "}
              </Text>
              <Text className="mt-0 mb-[5px] text-[16px] leading-[24px] text-gray-700">
                <strong>Email:</strong> {email}{" "}
              </Text>
              <Text className="mt-0 mb-[5px] text-[16px] leading-[24px] text-gray-700">
                <strong>Phone (optional):</strong> {phone}
              </Text>
              <Text className="mt-0 mb-[5px] text-[16px] leading-[24px] text-gray-700">
                <strong>Issue / Request:</strong>
                {message}
              </Text>
              <Text className="mt-5 mb-[24px] text-[16px] leading-[24px] text-gray-700">
                I would appreciate your assistance on this matter at your earliest convenience. Thank you for your time
                and support.
              </Text>

              <Hr className="my-[24px] border-gray-200" />

              <Text className="m-0 text-[12px] leading-[16px] text-gray-500">
                Best regards,
                <br />
                {t("company.brand-name")}
              </Text>
            </Section>

            <Section className="mt-[32px] border-t border-gray-200 pt-[24px]">
              <Text className="m-0 text-center text-[12px] leading-[16px] text-gray-400">
                {t("company.legal-name")}
                <br />
                {t("company.address")}
                <br />
                {t("company.address1")}
                <br />
                {t("company.state")}, {t("company.country")}, {t("company.zip-code")}
              </Text>

              <Text className="m-0 mt-[8px] text-center text-[12px] leading-[16px] text-gray-400">
                <a href="#" className="text-gray-400 underline">
                  Unsubscribe
                </a>{" "}
                | © {new Date().getFullYear()} {t("company.brand-name")}. {t("all-rights-reserved")}.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactUsEmail;
