import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReceiptEmailProps {
  orderId: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export const ReceiptEmail = ({ orderId, total, items }: ReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Recibo de tu compra en Drip Store</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Gracias por tu compra!</Heading>
          <Text style={text}>
            Hemos recibido tu orden <strong>#{orderId.slice(-6).toUpperCase()}</strong> y la estamos preparando para el envío.
          </Text>

          <Section style={orderSection}>
            <Text style={sectionTitle}>Resumen de la orden</Text>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <Text style={itemText}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={itemPrice}>
                  ${Number(item.price * item.quantity).toLocaleString("es-AR")}
                </Text>
              </div>
            ))}
            <Hr style={hr} />
            <div style={totalRow}>
              <Text style={totalLabel}>Total pagado</Text>
              <Text style={totalValue}>${Number(total).toLocaleString("es-AR")}</Text>
            </div>
          </Section>

          <Text style={footer}>
            Si tienes alguna pregunta sobre tu orden, responde a este correo.
            <br />
            El equipo de Drip Store.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReceiptEmail;

// Estilos en línea para asegurar compatibilidad con todos los clientes de correo (Gmail, Outlook, etc.)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const h1 = {
  color: "#171717",
  fontSize: "24px",
  fontWeight: "700",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#404040",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const orderSection = {
  marginTop: "32px",
  padding: "24px",
  backgroundColor: "#fafafa",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const sectionTitle = {
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  color: "#737373",
  marginBottom: "16px",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const itemText = {
  fontSize: "14px",
  color: "#404040",
  margin: "0",
};

const itemPrice = {
  fontSize: "14px",
  color: "#171717",
  fontWeight: "500",
  margin: "0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "16px 0",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "16px",
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#171717",
  margin: "0",
};

const totalValue = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#171717",
  margin: "0",
};

const footer = {
  color: "#737373",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "48px",
  textAlign: "center" as const,
};