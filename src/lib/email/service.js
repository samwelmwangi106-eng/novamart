import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  async sendOrderConfirmation(userEmail, order) {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',  // ✅ Changed to Resend test email
        to: userEmail,
        subject: `Order Confirmed #${order.orderNumber} - NovaMart`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #16a34a;">Asante for your order!</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order Number:</strong> #${order.orderNumber}</p>
              <p><strong>Total:</strong> KES ${order.totalAmount.toLocaleString()}</p>
              <p><strong>Payment:</strong> ${order.paymentMethod}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            <h3>Order Items:</h3>
            <ul>
              ${order.items.map(item => `
                <li>${item.product.name} x ${item.quantity} - KES ${(item.price * item.quantity).toLocaleString()}</li>
              `).join('')}
            </ul>
            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
              <p><strong>Delivery Address:</strong></p>
              <p>${order.shippingName}</p>
              <p>${order.shippingPhone}</p>
              <p>${order.shippingAddress}</p>
              <p>${order.shippingTown}, ${order.shippingCounty}</p>
            </div>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile?tab=orders" 
                 style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Track Your Order
              </a>
            </div>
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Expected Delivery: 3-5 business days
            </p>
          </div>
        `
      });
      console.log('✓ Order confirmation email sent to:', userEmail);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  },

  async sendWelcomeEmail(userEmail, userName) {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',  // ✅ Changed to Resend test email
        to: userEmail,
        subject: 'Karibu to NovaMart Kenya! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #16a34a;">Karibu ${userName}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Your NovaMart account is ready. Shop from thousands of quality products 
              with fast delivery across Kenya.
            </p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Special Offers:</h3>
              <ul>
                <li>✓ Free delivery on orders over KES 5,000</li>
                <li>✓ M-Pesa payment available</li>
                <li>✓ Secure checkout</li>
                <li>✓ 3-5 day delivery nationwide</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" 
                 style="background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Shopping
              </a>
            </div>
          </div>
        `
      });
      console.log('✓ Welcome email sent to:', userEmail);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPasswordReset(userEmail, resetToken) {
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
      await resend.emails.send({
        from: 'onboarding@resend.dev',  // ✅ Changed to Resend test email
        to: userEmail,
        subject: 'Reset Your NovaMart Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${resetUrl}" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        `
      });
      console.log('✓ Password reset email sent to:', userEmail);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  }
};
