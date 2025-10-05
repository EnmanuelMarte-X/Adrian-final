import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config";
import nodemailer from "nodemailer";

// Configurar el transporter de Nodemailer
function createTransporter() {
	return nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number.parseInt(process.env.SMTP_PORT || "587"),
		secure: process.env.SMTP_SECURE === "true", // true para puerto 465, false para otros puertos
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { type, formData } = body;

		// Validar que tenemos los datos necesarios
		if (!type || !formData) {
			return NextResponse.json(
				{ 
					success: false,
					error: "Tipo de formulario y datos son requeridos" 
				},
				{ status: 400 },
			);
		}

		let emailContent = "";
		let subject = "";

		if (type === "contact") {
			subject = `Nuevo mensaje de contacto - ${formData.subject || "Sin asunto"}`;
			emailContent = `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Teléfono:</strong> ${formData.phone || "No proporcionado"}</p>
        <p><strong>Asunto:</strong> ${formData.subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${formData.message}</p>
        <hr>
        <p><small>Enviado desde: ${siteConfig.url}</small></p>
      `;
		} else if (type === "supply") {
			subject = `Nueva solicitud de asociación - ${formData.businessName}`;
			emailContent = `
        <h2>Nueva solicitud de asociación comercial</h2>
        <p><strong>Nombre del negocio:</strong> ${formData.businessName}</p>
        <p><strong>Propietario:</strong> ${formData.ownerName}</p>
        <p><strong>RNC:</strong> ${formData.rnc}</p>
        <p><strong>Tipo de negocio:</strong> ${formData.businessType}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Teléfono:</strong> ${formData.phone}</p>
        <p><strong>Dirección:</strong> ${formData.address}</p>
        <p><strong>Compra mensual estimada:</strong> ${formData.monthlyPurchase}</p>
        <p><strong>Experiencia:</strong> ${formData.experience}</p>
        ${formData.comments ? `<p><strong>Comentarios:</strong> ${formData.comments}</p>` : ""}
        <hr>
        <p><small>Enviado desde: ${siteConfig.url}</small></p>
      `;
		} else if (type === "return") {
			subject = `Solicitud de devolución - Pedido ${formData.orderNumber}`;
			emailContent = `
        <h2>Nueva solicitud de devolución</h2>
        <p><strong>Número de pedido:</strong> ${formData.orderNumber}</p>
        <p><strong>Fecha de compra:</strong> ${formData.purchaseDate}</p>
        <p><strong>Cliente:</strong> ${formData.customerName}</p>
        <p><strong>Email:</strong> ${formData.customerEmail}</p>
        <p><strong>Producto:</strong> ${formData.productName}</p>
        <p><strong>Motivo de devolución:</strong></p>
        <p>${formData.returnReason}</p>
        <hr>
        <p><small>Enviado desde: ${siteConfig.url}</small></p>
      `;
		} else {
			return NextResponse.json(
				{ 
					success: false,
					error: "Tipo de formulario no válido" 
				},
				{ status: 400 },
			);
		}

		// Validar configuración SMTP
		if (
			!process.env.SMTP_HOST ||
			!process.env.SMTP_USER ||
			!process.env.SMTP_PASS
		) {
			console.error("Missing SMTP configuration");
			return NextResponse.json(
				{ 
					success: false,
					error: "Configuración de email no disponible" 
				},
				{ status: 500 },
			);
		}

		// Configurar y enviar el email usando Nodemailer
		const transporter = createTransporter();

		const mailOptions = {
			from: {
				name: "Jhenson Supply System",
				address: process.env.SMTP_FROM || process.env.SMTP_USER,
			},
			to: siteConfig.contact.email.admin,
			subject: subject,
			html: emailContent,
			replyTo: formData.email || undefined, // Para responder directamente al cliente
		};

		// Verificar la conexión SMTP antes de enviar
		await transporter.verify();

		// Enviar el email
		const info = await transporter.sendMail(mailOptions);

		console.log("Email enviado exitosamente:", info.messageId);

		return NextResponse.json({
			success: true,
			message: "Email enviado correctamente",
			details: {
				type,
				to: siteConfig.contact.email.admin,
				from: mailOptions.from,
				subject,
				messageId: info.messageId,
			},
		});
	} catch (error) {
		console.error("Error enviando email:", error);
		return NextResponse.json(
			{ 
				success: false,
				error: "Error interno del servidor al enviar el email" 
			},
			{ status: 500 },
		);
	}
}
