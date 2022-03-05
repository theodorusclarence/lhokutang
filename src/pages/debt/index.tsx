import { format } from 'date-fns';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import * as React from 'react';

import { prisma } from '@/lib/prisma';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function UtangPiutangPage({
  debts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <Seo templateTitle='UtangPiutang' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-20'>
            {debts.map((debt) => (
              <div key={debt.id}>
                <h2 className='h3'>{debt.description}</h2>
                <p>{debt.date}</p>
                <p>{debt.amount}</p>
                <p>{debt.relativeType}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  const debts = await prisma.debt.findMany({
    where: {
      OR: [
        {
          creditor: {
            email: session?.user?.email,
          },
        },
        {
          debtorId: {
            equals: session?.user.id,
          },
        },
      ],
    },
    include: {
      creditor: true,
    },
  });
  const users = await prisma.user.findMany();

  const parsedDebts = debts.map(
    ({ amount, date, creditor, debtorId, type, description, id }) => ({
      relativeType: debtorId === session?.user.id ? 'utang' : 'piutang',
      amount,
      type,
      description,
      id,
      creditor,
      debtor: users.find((user) => user.id === debtorId),
      date: format(date, 'yyyy-MM-dd'),
    })
  );

  return {
    props: { debts: parsedDebts },
  };
};
