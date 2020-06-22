module = angular.module('sportily.registration.services', ['sportily.api']);

module.factory 'StripeService', ($q, StripePublishableKey, SportilyApi) ->
         getSession: (amount, email, name, description, organisation) ->
             return SportilyApi.all('stripe').customGET('', {
                  amount: amount,
                  email: email,
                  name: name,
                  source: 'website',
                  description: description,
                  organisation_id: organisation.id
              })
          redirectToPayment: (stripeAccountId, sessionId) ->
            stripe = Stripe(StripePublishableKey, {
                stripeAccount: stripeAccountId
            });

            return stripe.redirectToCheckout({
              sessionId: sessionId
            })

module.factory 'PaymentService', ($q, Transactions, Payments) ->
       getNational = (member) ->
          orgs = null
          national = [];
          orgs = member.financial_summary.owed.organisations;
          Object.getOwnPropertyNames(orgs).forEach((prop) ->
             if (orgs[prop].type == 'national')
               orgs[prop].id = prop;
               national = orgs[prop];
          );
          return national;


        getRegionals = (member) ->
          orgs = null;
          regions = [];
          orgs = member.financial_summary.owed.organisations;
          Object.getOwnPropertyNames(orgs).forEach((prop) ->
             if (orgs[prop].type == 'regional')
               orgs[prop].id = prop;
               regions.push(orgs[prop]);

          );
          return regions;

        return {
            take: (stripeSessionId, member, amount, paymentOrganisation) ->
              national = getNational(member);
              regions = getRegionals(member);
              promises = regions.map((region) ->

                  return Transactions.post({
                      type: 'standard',
                      amount: region.total,
                      source_id: member.id,
                      target_id: null,
                      status: 'pending',
                      organisation_id: region.id,
                      target_organisation_id: paymentOrganisation.payment_details.id,
                      method: "online"
                  });

              );

              if (national.total > 0)
                nationalPromise = Transactions.post({
                    type: 'standard',
                    amount: national.total,
                    source_id: member.id,
                    target_id: null,
                    status: 'pending',
                    organisation_id: national.id,
                    target_organisation_id: paymentOrganisation.payment_details.id,
                    method: "online"
                });
                promises.push(nationalPromise);

              return $q.all(promises).then((transactions) ->
                  return Payments.post({
                    amount: member.financial_summary.owed.total,
                    organisation_id: paymentOrganisation.payment_details.id,
                    stripe_payment_token: stripeSessionId,
                    transaction_ids: transactions.map((transaction) ->  return transaction.id; )
                  });
              );
        }
