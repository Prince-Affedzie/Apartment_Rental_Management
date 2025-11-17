const cron = require('node-cron');
const moment = require('moment');
const { sendSMSToList } = require('./SMSConfig');
const { Tenants } = require('../Models/Tenants');
const { User } = require('../Models/Users');

function startRentNotifier() {
  // Run every 15 days at 8 AM (UTC)
  cron.schedule('0 8 */15 * *', async () => {
    process.env.TZ = 'UTC'; // Ensure runs in UTC
    console.log('📅 Running Rent Expiry Check Job...');

    try {
      const today = moment().startOf('day'); // Start of day for accurate comparison
      
      // Calculate exact dates for 3 months and 1 month from today
      const exactlyThreeMonthsFromNow = today.clone().add(3, 'months');
      const exactlyOneMonthFromNow = today.clone().add(1, 'month');

      // Find tenants whose expiration date matches exactly 3 months or 1 month from today
      const tenants = await Tenants.find({
        expirationDate: {
          $in: [
            exactlyThreeMonthsFromNow.toDate(),
            exactlyOneMonthFromNow.toDate()
          ]
        }
      });

      if (tenants.length === 0) {
        console.log('✅ No rent expirations at 3-month or 1-month mark today.');
        return;
      }

      // Group tenants by notification type
      const threeMonthTenants = tenants.filter(tenant => 
        moment(tenant.expirationDate).isSame(exactlyThreeMonthsFromNow, 'day')
      );
      
      const oneMonthTenants = tenants.filter(tenant => 
        moment(tenant.expirationDate).isSame(exactlyOneMonthFromNow, 'day')
      );

      // Send notifications for 3-month mark tenants
      for (const tenant of threeMonthTenants) {
        const daysLeft = moment(tenant.expirationDate).diff(today, 'days');
        const message = `Hi ${tenant.tenantName}, your rent expires in ${daysLeft} day(s) on ${moment(tenant.expirationDate).format('Do MMM YYYY')}. Please plan for renewal.`;
        
        await sendSMSToList([tenant.tenantPhone], message);
      }

      // Send notifications for 1-month mark tenants
      for (const tenant of oneMonthTenants) {
        const daysLeft = moment(tenant.expirationDate).diff(today, 'days');
        const message = `Hi ${tenant.tenantName}, your rent expires in ${daysLeft} day(s) on ${moment(tenant.expirationDate).format('Do MMM YYYY')}. Please renew soon.`;
        
        await sendSMSToList([tenant.tenantPhone], message);
      }

      // Send admin notification
      const admin = await User.findOne({ role: 'Admin' });
      
      if (admin?.phone) {
        let adminMessage = '';
        
        if (threeMonthTenants.length > 0 && oneMonthTenants.length > 0) {
          const threeMonthNames = threeMonthTenants.map(t => t.tenantName).join(', ');
          const oneMonthNames = oneMonthTenants.map(t => t.tenantName).join(', ');
          adminMessage = `Rent Reminders: ${threeMonthTenants.length} tenant(s) at 3-month mark (${threeMonthNames}), ${oneMonthTenants.length} tenant(s) at 1-month mark (${oneMonthNames})`;
        } else if (threeMonthTenants.length > 0) {
          const names = threeMonthTenants.map(t => t.tenantName).join(', ');
          adminMessage = `Rent Reminders: ${threeMonthTenants.length} tenant(s) at 3-month mark: ${names}`;
        } else if (oneMonthTenants.length > 0) {
          const names = oneMonthTenants.map(t => t.tenantName).join(', ');
          adminMessage = `Rent Reminders: ${oneMonthTenants.length} tenant(s) at 1-month mark: ${names}`;
        }
        
        if (adminMessage) {
          await sendSMSToList([admin.phone], adminMessage);
        }
      }

      console.log(`📱 SMS reminders sent:`);
      console.log(`   - ${threeMonthTenants.length} tenant(s) at 3-month mark`);
      console.log(`   - ${oneMonthTenants.length} tenant(s) at 1-month mark`);
      
    } catch (err) {
      console.error('❌ Error during rent notifier cron:', err.message);
    }
  });

  console.log('🛎️ Rent notifier cron job initialized.');
}

module.exports = startRentNotifier;