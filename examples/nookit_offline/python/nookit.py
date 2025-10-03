import pygame, sys

pygame.init()

resolution = (640,480)

window = pygame.display.set_mode(resolution)
pygame.display.set_caption("Nookit")

fontLarge = pygame.font.SysFont("Arial",32)

boxSize = (resolution[0]/2,(resolution[1]/2)/2)

clock = pygame.time.Clock()

class Question:
    global window
    def __init__(self,question,answers,valid_answer,colors=[[(255,0,0),(0,255,0)],[(0,0,255),(255,255,0)]]): # Valid answer is text
        self.q = question
        self.a = answers
        self.v = valid_answer
        self.c = colors
        self.active = True
        self.result = None
    def render(self):
        text = fontLarge.render(self.q,True,(0,0,0))
        renderSize = fontLarge.size(self.q)
        window.blit(text,((resolution[0]/2)-renderSize[0]/2,(resolution[1]/2/2+16)-renderSize[1]/2))
        for x in range(0,2):
            for y in range(0,2):
                pygame.draw.rect(window,self.c[x][y],((resolution[0]/2)*x,(resolution[1]/2) + ((resolution[1]/2/2)*y),boxSize[0],boxSize[1]))
                innerText = self.a[x + y*2]
                renderSize = fontLarge.size(innerText)
                colorX = (127,127,127) if y == 1 else (255,255,255)
                text = fontLarge.render(innerText,True,colorX)
                window.blit(text,((resolution[0]/2)*x + boxSize[0]/2-renderSize[0]/2,((resolution[1]/2)+(resolution[1]/2/2)*y)-renderSize[1]/2+ boxSize[1]/2))
    def handle_event(self,event):
        if event.type == pygame.MOUSEBUTTONUP:
            print("Mouse!")
            pos = pygame.mouse.get_pos()
            for x in range(0,2):
                for y in range(0,2):
                    rect = ((resolution[0]/2)*x,(resolution[1]/2) + ((resolution[1]/2/2)*y),boxSize[0],boxSize[1])
                    xp = rect[0]
                    yp = rect[1]
                    xs = rect[0] + rect[2]
                    ys = rect[1] + rect[3]
                    if pos[0] > xp - 1 and pos[0] < xs + 1 and pos[1] > yp - 1 and pos[1] < ys + 1:
                        self.result = self.a[x + y*2] == self.v
                        self.active = False
        pass

q = None

q_idx = 0

questions = []

# Question("hi",["yes","no","perchance","hm"],"hm")

import json

infile = json.loads(open(sys.argv[1]).read())

for i in infile:
    # {"question":"hi","options":["yes","no","perchance","hm"],"correct":"hm"}
    questions.append(Question(i["question"],i["options"],i["correct"]))

q = questions[0]

name = sys.argv[2]

if len(name) > 16:
    name = name[:16]

elapsed = 0.0

q_elapsed = 0.0

points = 0

while True:
    window.fill((255,255,255))
    dt = clock.tick(60) / 1000.0  # Convert milliseconds to seconds
    username = fontLarge.render(name,True,(255,255,255))
    thing2 = fontLarge.render("© " + str(points),True,(255,255,255))
    pygame.draw.rect(window,(255,0,255),(0,0,resolution[0],32))
    if q.active:
        q.render()
        q_elapsed += dt
    else:
        if elapsed < 2.0:
            elapsed += dt
            pygame.draw.rect(window,(0,127,127),(0,32,resolution[0],resolution[1]-32))
            spin = fontLarge.render("Sly like a fox?",True,(255,255,255))
            window.blit(spin,(resolution[0]/2-spin.get_width()/2,resolution[1]/2-spin.get_height()/2))
        else:
            if elapsed < 5.0:
                if q.result:
                    pygame.draw.rect(window,(0,255,0),(0,32,resolution[0],resolution[1]-32))
                    spin = fontLarge.render("Speedy like a rabbit, and sly like a fox!",True,(255,255,255))
                else:
                    pygame.draw.rect(window,(255,0,0),(0,32,resolution[0],resolution[1]-32))
                    spin = fontLarge.render("Speedy like a rabbit, but at what cost?",True,(255,255,255))
                window.blit(spin,(resolution[0]/2-spin.get_width()/2,resolution[1]/2-spin.get_height()/2))
                elapsed += dt
            else:
                result = round(15 - (q_elapsed))
                if result < 1: result = 1
                points += result
                q_elapsed = 0.0
                elapsed = 0.0
                if q_idx < len(questions) - 1:
                    q_idx += 1
                    q = questions[q_idx]
                else:
                    print("You got",points,"points!")
                    exit()
    window.blit(username,(0,0))
    window.blit(thing2,(resolution[0] - thing2.get_width(),0))
    for event in pygame.event.get():
        if event.type == pygame.QUIT: exit()
        elif q.active: q.handle_event(event)
    pygame.display.flip()

